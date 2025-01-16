import { useState, useEffect } from "react";

const TypeWriterText = ({ text = "" }) => {
    const [displayedText, setDisplayedText] = useState(""); // Nội dung đã hiển thị
    const [currentIndex, setCurrentIndex] = useState(0); // Vị trí ký tự hiện tại
    const speed = 30; // Tốc độ gõ (ms) cho mỗi ký tự

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex]);
                setCurrentIndex((prev) => prev + 1); // Tăng chỉ số ký tự
            }, speed);

            return () => clearTimeout(timeout); // Dọn dẹp timeout
        }
    }, [currentIndex, text]); // Lắng nghe thay đổi của `currentIndex` hoặc `text`

    return <span>{displayedText}</span>;
};

export default TypeWriterText;
