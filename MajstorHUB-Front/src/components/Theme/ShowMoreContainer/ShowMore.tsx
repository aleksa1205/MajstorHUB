import { useState, useRef, useEffect } from 'react';
import classes from './ShowMore.module.css';

export default function ShowMore({ text }: { text: string }) {
    const [active, setActive] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [maxHeight, setMaxHeight] = useState<number | string>('6em'); // Initial value for max-height
    const textRef = useRef<HTMLDivElement>(null);

    const checkOverflow = () => {
        const textElement = textRef.current;
        if (textElement) {
            setIsOverflowing(textElement.scrollHeight > textElement.clientHeight);
        }
    };

    useEffect(() => {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [text]);

    useEffect(() => {
        if (active) {
            // If the text is expanding, set max-height to its actual height
            setMaxHeight(`${textRef.current?.scrollHeight}px`);
        } else {
            // If collapsing, set it back to the default height
            setMaxHeight('6em');
        }
    }, [active]);

    return (
        <div className={classes.main}>
            <div
                ref={textRef}
                className={`${classes.text} ${active ? classes.active : ''}`}
                style={{ maxHeight }}
            >
                {text}
            </div>
            {isOverflowing && (
                <button onClick={() => setActive(!active)} className='secondLink'>
                    {active ? 'Prikaži manje' : 'Prikaži Više'}
                </button>
            )}
        </div>
    );
}
