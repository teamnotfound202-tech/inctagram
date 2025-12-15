import {useCallback, useEffect, useRef, useState} from "react";

// Хук для умного скролла (!!!!работает только с flex-direction: column-reverse)
export const useMessagesScroll = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    // При column-reverse scrollTop = 0 означает визуально низ контейнера
    const scrollToBottom = useCallback(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, []);

    // При column-reverse scrollTop близко к 0 = мы внизу (визуально)
    const checkScrollPosition = useCallback(() => {
        const container = messagesContainerRef.current;

        if (!container) return;

        const {scrollTop} = container;
        // При column-reverse: scrollTop = 0 это визуально низ, поэтому проверяем близость к 0
        const isCloseToBottom = scrollTop > -150;
        setIsAtBottom(isCloseToBottom);
    }, []);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', checkScrollPosition, {passive: true});
        return () => container.removeEventListener('scroll', checkScrollPosition);
    }, [checkScrollPosition]);

    return {messagesEndRef, messagesContainerRef, isAtBottom, scrollToBottom};
};