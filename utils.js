function debounce(func, delay = 1000) {
    let timeoutId = 0;

    return (...args) => {
        // args: additional arguments that the callback need
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
}
