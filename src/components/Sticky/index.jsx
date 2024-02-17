import style from './index.module.scss'
import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
const Sticky = ({ children, scrollElement }) => {
    const placeholderRef = useRef()
    const contentRef = useRef()
    useEffect(() => {
        const placeholderEle = placeholderRef.current
        const contentEle = contentRef.current
        const height = contentEle.offsetHeight
        const handleScroll = () => {
            const { top } = placeholderEle.getBoundingClientRect()
            if (top < 0) {
                contentEle.classList.add(style.fixed)
                placeholderEle.style.height = `${height}px`
            } else {
                contentEle.classList.remove(style.fixed)
                placeholderEle.style.height = '0px'
            }
        }
        scrollElement.current.addEventListener('scroll', handleScroll)
    }, [scrollElement])
    return (
        <div>
            <div className={style.placeholder} ref={placeholderRef}></div>
            <div className={style.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
}

Sticky.propTypes = {
    children: PropTypes.node,
    scrollElement: PropTypes.object
}

export default Sticky;