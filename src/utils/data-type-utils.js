Object.prototype.clone = Object.prototype.clone || function() {
    try {
        return JSON.parse(JSON.stringify(this));
    } catch (error) {
        return null;
    }
}