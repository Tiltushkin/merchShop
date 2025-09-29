import s from "./CartModal.module.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { selectCartItems, selectCartTotal, selectCartOpen, close, addItem, decrementItem, removeItem, clear } from "../../store/slices/cartSlice";
import cn from "classnames";
import utils from '../../utils/utils';

const CartModal = () => {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector((state: RootState) => selectCartItems(state));
    const total = useSelector((state: RootState) => selectCartTotal(state));
    const open = useSelector((state: RootState) => selectCartOpen(state));

    const fmt = (n:number) => n.toLocaleString('ru-RU');

    if (!open) return null;

    return (
        <div className={s.overlay} onMouseDown={() => dispatch(close())} aria-hidden>
            <div className={`${s.modal} surface-glass`} onMouseDown={(e) => e.stopPropagation()}>
                <div className={s.header}>
                    <h4>Корзина</h4>
                    <button className={s.close} onClick={() => dispatch(close())} aria-label="Close cart">✕</button>
                </div>

                <div className={s.body}>
                    {items.length === 0 ? (
                        <div className={s.empty}>Корзина пуста — добавьте что-нибудь</div>
                    ) : (
                        items.map(i => {
                            const unit = utils.calcWithDiscount(i.product.cost, i.product.discount);
                            const totalItem = Math.round(unit * i.quantity);
                            return (
                                <div className={s.item} key={i.product.id}>
                                    <img src={i.product.images?.[0]} alt={i.product.name} className={s.thumb} />
                                    <div className={s.info}>
                                        <div className={s.name}>{i.product.name}</div>
                                        <div className={s.subtitle}>{i.product.subtitle}</div>
                                        {i.product.discount > 0 && (
                                            <div className={s.origPrice}>
                                                <span className={s.orig}>{(i.product.cost * i.quantity).toLocaleString('ru-RU')}₸</span>
                                                <span className={s.discountTag}>-{i.product.discount}%</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className={s.right}>
                                        <div className={s.controls}>
                                            <button onClick={() => dispatch(decrementItem(i.product.id))} aria-label="decrement">−</button>
                                            <span className={s.qty}>{i.quantity}</span>
                                            <button onClick={() => dispatch(addItem(i.product))} aria-label="increment">+</button>
                                        </div>

                                        <div className={s.price}>{fmt(totalItem)}₸</div>
                                        <button className={s.remove} onClick={() => dispatch(removeItem(i.product.id))} aria-label="remove">✕</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className={s.footer}>
                    <div className={s.total}>Итого: <strong>{fmt(Math.round(total))}₸</strong></div>
                    <div className={s.actions}>
                        <button className={cn(s.button, s.clear)} onClick={() => dispatch(clear())}>Очистить</button>
                        <button className={cn(s.button, s.checkout)} onClick={() => { alert('Фиктивная оплата — в демке нет бекенда'); }}>Оплатить</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartModal;
