import styles from './InfinityScroll.module.scss';
import { useEffect, useRef } from 'react';
import { useOnScreen } from '../../../hooks/useOnScreen';

type Props<T> = {
    items: T[];
    onItemRender: (item: T, index: number) => React.ReactNode;
    topLoading?: boolean;
    hasTopNext?: boolean;
    onReachTop?: () => void;
    bottomLoading?: boolean;
    hasBottomNext?: boolean;
    onReachBottom?: () => void;
    inverse?: boolean;
    innerRef?: React.LegacyRef<HTMLDivElement>;
} & Omit<JSX.IntrinsicElements['div'], 'ref'>;

export const InfinityScroll = <T,>({
    items,
    onItemRender,
    topLoading,
    hasTopNext,
    onReachTop,
    bottomLoading,
    hasBottomNext,
    onReachBottom,
    inverse,
    className,
    innerRef,
    ...rest
}: Props<T>) => {
    const topLoaderRef = useRef<HTMLDivElement>(null);
    const topLoaderOnScreen = useOnScreen(topLoaderRef);

    const bottomLoaderRef = useRef<HTMLDivElement>(null);
    const bottomLoaderOnScreen = useOnScreen(bottomLoaderRef);

    useEffect(() => {
        if (topLoaderOnScreen && hasTopNext && !!onReachTop && topLoading === false) {
            onReachTop();
        }
    }, [topLoaderOnScreen]);

    useEffect(() => {
        if (bottomLoaderOnScreen && hasBottomNext && !!onReachBottom && bottomLoading === false) {
            onReachBottom();
        }
    }, [bottomLoaderOnScreen]);

    return (
        <div {...rest} ref={innerRef} className={`${className} ${styles.infinityScrollWrapper}`}>
            <div className={styles.infinityScroll}>
                {onReachTop && <div className={`${styles.loader} ${styles.topLoader}`} ref={topLoaderRef} />}
                <div
                    className={styles.innerInfinityScroll}
                    style={{ flexDirection: inverse ? 'column-reverse' : 'column' }}
                >
                    {items.map((item, i) => onItemRender(item, i))}
                </div>
                {onReachBottom && <div className={`${styles.loader} ${styles.bottomLoader}`} ref={bottomLoaderRef} />}
            </div>
        </div>
    );
};