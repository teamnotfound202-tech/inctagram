import {useCallback, useEffect, useRef, useState} from "react";

// Хук для умного скролла
export const useMessagesScroll = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const checkScrollPosition = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isCloseToBottom = scrollHeight - scrollTop - clientHeight < 150;
    setIsAtBottom(isCloseToBottom);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition, { passive: true });
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  return { messagesEndRef, messagesContainerRef, isAtBottom, scrollToBottom };
};