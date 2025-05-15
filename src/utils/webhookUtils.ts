// Send message to webhook

// Function to format links in messages
const formatLinksInMessage = (message: string): string => {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Replace URLs with formatted links
  return message.replace(urlRegex, (url) => {
    // Remove any trailing punctuation
    const cleanUrl = url.replace(/[.,;:!?]$/, '');
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
  });
};

export const sendToWebhook = async (
  webhookUrl: string,
  message: string | undefined,
  files: File[] | undefined,
  chatId: string,
  cloudflareAccessId: string,
  clientSecret: string
): Promise<string> => {
  try {
    if (!webhookUrl) {
      throw new Error('Webhook URL is not set');
    }

    console.log('Sending to webhook:', {
      url: webhookUrl,
      hasMessage: !!message,
      filesCount: files?.length || 0,
      chatId,
      hasAccessId: !!cloudflareAccessId
    });

    const formData = new FormData();
    formData.append('chatId', chatId);
    
    if (message) {
      // Format links in the message before sending
      const formattedMessage = formatLinksInMessage(message);
      formData.append('message', formattedMessage);
    }
    
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minute timeout
    
    console.log('Sending request with headers:', {
      'CF-Access-Client-Id': cloudflareAccessId,
      'CF-Access-Client-Secret': clientSecret
    });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      headers: {
        'CF-Access-Client-Id': cloudflareAccessId,
        'CF-Access-Client-Secret': clientSecret
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }
    
    // Get the raw response text first
    const responseText = await response.text();
    
    // Log the raw response for debugging
    console.log('Raw webhook response:', responseText);
    
    // Check if the response is empty
    if (!responseText || responseText.trim() === '') {
      return 'Request processed successfully, but no response data was returned';
    }
    
    // Try to parse the response as JSON
    try {
      // Only try to parse if there's actual content
      const data = responseText ? JSON.parse(responseText) : null;
      
      // Better handling of response formats
      if (typeof data === 'string') {
        return data;
      } else if (data && typeof data.message === 'string') {
        return data.message;
      } else if (data && typeof data.output === 'string') {
        return data.output;
      } else if (Array.isArray(data) && data.length > 0) {
        return typeof data[0] === 'string' ? data[0] : 
               (data[0].message || data[0].output || 'Received response from webhook');
      } else if (data) {
        // Inspect the actual response structure for better handling
        console.log("Response data structure:", JSON.stringify(data));
        return 'Received structured response from webhook';
      } else {
        return 'Request processed successfully';
      }
    } catch (parseError) {
      // If we can't parse the response as JSON, return the raw text (truncated if too long)
      console.error('Error parsing JSON response:', parseError);
      
      // Return the raw text if it's reasonably sized, otherwise truncate it
      if (responseText.length <= 500) {
        return `Response: ${responseText}`;
      } else {
        // Truncate long responses
        return `Response: ${responseText.substring(0, 500)}... (truncated)`;
      }
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    
    // Improve error message for network-related errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. The webhook server might be unavailable.');
    } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
      throw new Error('Network error: Cannot connect to the webhook. Please check your internet connection and webhook URL.');
    } else if (error instanceof SyntaxError && error.message.includes('JSON.parse')) {
      throw new Error('Invalid response format. The webhook did not return valid JSON data.');
    }
    
    throw error;
  }
};