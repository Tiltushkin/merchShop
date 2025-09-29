import s from "./ProductCard.module.scss";
import type { Product } from "../../shared/types/types";
import { useRef } from "react";
import { motion } from "framer-motion";
import utils from "../../utils/utils";
import * as React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { addItem } from "../../store/slices/cartSlice";
import cn from "classnames";

interface Props {
    product: Product;
    onOpen: (p: Product) => void;
    cardType?: number;
}

const ProductCard = ({ product, onOpen, cardType = 1 }: Props) => {
    const image = product.images?.[0] || "";
    const cardRef = useRef<HTMLElement | null>(null);

    const cardClassnames = cn(
        s.card,
        {
            [s.defaultCard]: cardType == 1,
            [s.poster]: cardType == 2,
        },
    );

    const flyToCart = (imgSrc?: string) => {
        if (!imgSrc) return;
        const cartEl = document.querySelector<HTMLImageElement>(".cartIcon");
        const startRect = cardRef.current?.querySelector(".media")?.getBoundingClientRect();
        const endRect = cartEl?.getBoundingClientRect();
        if (!startRect || !endRect) {
            console.log("Added to cart", product.id);
            return;
        }

        const fly = document.createElement("img");
        fly.src = imgSrc;
        fly.alt = product.name;
        fly.style.position = "fixed";
        fly.style.left = `${startRect.left}px`;
        fly.style.top = `${startRect.top}px`;
        fly.style.width = `${Math.min(startRect.width, 140)}px`;
        fly.style.height = "auto";
        fly.style.zIndex = "1500";
        fly.style.borderRadius = "8px";
        fly.style.pointerEvents = "none";
        fly.style.transition = "transform 600ms cubic-bezier(.22,.9,.32,1), opacity 420ms ease, left 600ms, top 600ms";
        document.body.appendChild(fly);

        const dx = endRect.left + endRect.width / 2 - (startRect.left + startRect.width / 2);
        const dy = endRect.top + endRect.height / 2 - (startRect.top + startRect.height / 2);
        fly.style.transform = `translate(${dx}px, ${dy}px) scale(.18) rotate(-10deg)`;
        fly.style.opacity = "0.6";

        setTimeout(() => {
            fly.style.opacity = "0";
        }, 420);

        setTimeout(() => {
            fly.remove();
            console.log("Added to cart", product.id);
        }, 700);
    };

    const dispatch = useDispatch<AppDispatch>();

    const onBuyClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        flyToCart(image);
        try { dispatch(addItem(product)); } catch(e) { console.warn('dispatch failed', e); }
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(product);
        }
    };

    return (
        <motion.article
            ref={cardRef}
            className={cardClassnames}
            onClick={() => onOpen(product)}
            role="button"
            tabIndex={0}
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ translateY: -6, scale: 1.01 }}
            transition={{ duration: 0.28 }}
            aria-label={`Открыть ${product.name}`}
        >
            <div
                className={s.media}
                style={image ? { backgroundImage: `url(${image})` } : undefined}
                aria-hidden={image ? "false" : "true"}
            >
                {product.discount > 0 && (
                    <div className={s.badge}>{`−${product.discount}%`}</div>
                )}
                {image && (
                    <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                    />
                )}
            </div>

            <div className={s.info}>
                <div className={s.left}>
                    <h3 className={s.title}>{product.name}</h3>
                    <p className={s.subtitle}>{product.subtitle}</p>
                </div>

                <div className={s.right}>
                    {product.discount > 0 && (
                        <div>
                            <div className={s.price} style={{ textDecoration: "line-through 1.5px var(--primary)" }}>
                                {utils.ssp(product.cost)}₸
                            </div>
                            <div className={s.subprice}>
                                {utils.ssp(utils.calcWithDiscount(product.cost, product.discount))}₸
                            </div>
                        </div>
                    )}
                    {product.discount < 1 && (
                        <div className={s.price}>{utils.ssp(product.cost)}₸</div>
                    )}
                    <button
                        className={s.buy}
                        onClick={onBuyClick}
                        aria-label={`Добавить ${product.name} в корзину`}
                        title="Добавить в корзину"
                    >
                        В корзину
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

export default ProductCard;