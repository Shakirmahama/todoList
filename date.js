


exports.getdate =() => {
    
    var day = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    return day.toLocaleDateString("en-US", options);
}