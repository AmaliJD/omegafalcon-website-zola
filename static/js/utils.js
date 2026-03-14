function gotoUrl(event, url, ignoreIfTextSelected = false) {
    // Check if the user has highlighted any text
    const selection = window.getSelection().toString();
    
    // Only navigate if no text is selected
    if (!ignoreIfTextSelected || (ignoreIfTextSelected && !selection)) {
        location.href = url;
    }
}