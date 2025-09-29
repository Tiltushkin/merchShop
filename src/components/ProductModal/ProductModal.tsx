import s from "./ProductModal.module.scss";
import type { Product } from "../../shared/types/types";
import utils from "../../utils/utils";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    product: Product | null;
    onClose: () => void;
}

const backdrop = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalAnim = { hidden: { y: 18, opacity: 0, scale: 0.98 }, visible: { y: 0, opacity: 1, scale: 1 } };

const ProductModal = ({ product, onClose }: Props) => {
    if (!product) return null;
    const discountedPrice = utils.calcWithDiscount(product.cost, product.discount);
    const discount = product.cost > Math.floor(discountedPrice);

    return (
        <AnimatePresence>
            <motion.div
                className={s.overlay}
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdrop}
                transition={{ duration: 0.22 }}
            >
                <motion.div
                    className={s.modal}
                    onClick={(e) => e.stopPropagation()}
                    variants={modalAnim}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.28 }}
                >
                    <button className={s.close} onClick={onClose} aria-label="Close">✕</button>

                    <div className={s.body}>
                        <div
                            className={s.left}
                            style={product.images?.[0] ? { backgroundImage: `url(${product.images[0]})` } : undefined}
                            role="img"
                            aria-label={product.name}
                        />

                        <div className={s.right}>
                            <h2>{product.name}</h2>
                            {discount && (
                                <div>
                                    <p className={s.price} style={{ textDecoration: "line-through 1.5px var(--primary)" }}>{utils.ssp(product.cost)}₸</p>
                                    <p className={s.newPrice}>{utils.ssp(discountedPrice)}₸</p>
                                </div>
                            )}
                            {!discount && (
                                <p className={s.price}>{utils.ssp(product.cost)}₸</p>
                            )}
                            <p className={s.desc}>{product.description}</p>

                            <div className={s.actions}>
                                <button
                                    className={s.primary}
                                    onClick={() => {
                                        console.log("Купить сейчас:", product.id);
                                        (document.querySelector(".cartIcon") as HTMLElement)?.animate(
                                            [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }],
                                            { duration: 420, easing: "ease-out" }
                                        );
                                    }}
                                >
                                    Купить сейчас
                                </button>

                                <button
                                    className={s.ghost}
                                    onClick={() => {
                                        console.log("Добавлено в избранное", product.id);
                                    }}
                                >
                                    ❤ В избранное
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductModal;