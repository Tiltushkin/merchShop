import s from './Layout.module.scss';
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props { children: ReactNode; }
const THEME_KEY = 'app_theme';

const MainLayout = ({ children }: Props) => {
    const [theme, setTheme] = useState<'light'|'dark'>(() => (localStorage.getItem(THEME_KEY) as 'light'|'dark') ?? 'dark');

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        root.classList.toggle('theme-dark', theme === 'dark');
        root.classList.toggle('theme-light', theme === 'light');
        body.classList.toggle('theme-dark', theme === 'dark');
        body.classList.toggle('theme-light', theme === 'light');
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <div className={s.layout}>
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <motion.main initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .36 }} className={s.content}>
                {children}
            </motion.main>
            <Footer />
        </div>
    );
};

export default MainLayout;