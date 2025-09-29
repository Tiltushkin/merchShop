import s from './Layout.module.scss';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { toggleOpen, selectCartCount } from '../store/slices/cartSlice';
import CartModal from '../components/Cart/CartModal';

interface Props {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

const Header = ({ theme, onToggleTheme }: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    const count = useSelector((state: RootState) => selectCartCount(state));
    return (
        <header className={s.header}>
            <div className={s.header__content}>
                <div className={s.title}>
                    <div className={s.logoBadge} aria-hidden>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="9" fill="white" opacity="0.06" />
                        </svg>
                    </div>
                    <div>
                        <div style={{fontSize:14}}>Merch <span style={{opacity:.6, marginLeft:8, fontWeight:600}}>Shop</span></div>
                        <div style={{fontSize:11, color:'var(--muted)'}}>Gaming merch & drops</div>
                    </div>
                </div>

                <div className={s.actions}>
                    <motion.button whileTap={{ scale: .96 }} className={s.themeBtn} onClick={onToggleTheme} aria-label="Toggle theme">
                        {theme === 'dark' ? 'Светлая' : 'Тёмная'}
                    </motion.button>

                    <div className={s.cartWrap}>
                        <motion.button whileTap={{ scale: .96 }} className={s.cartBtn} onClick={() => dispatch(toggleOpen())} aria-label="Open cart">
                            <img src={theme === 'dark' ? "./cart-white.svg" : "./cart.svg"} className={s.cartIcon} alt="cart" />
                            <span className={s.cartCount}>{count}</span>
                        </motion.button>
                        <CartModal />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;