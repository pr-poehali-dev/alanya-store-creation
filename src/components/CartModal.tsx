import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^\d]/g, "")) || 0;
  };

  const totalPrice = items.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("https://functions.poehali.dev/963ba4ca-4a9a-4e63-b9ea-0ae06c94d53e", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          items: items.map((item) => ({
            name: `${item.name} x${item.quantity}`,
            price: `${parsePrice(item.price) * item.quantity} ₽`,
          })),
          total: `${totalPrice} ₽`,
          comment: formData.comment,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", comment: "" });
        clearCart();
        setTimeout(() => {
          onClose();
          setSubmitStatus("idle");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Корзина</DialogTitle>
          <DialogDescription>
            {items.length > 0 ? "Проверьте товары и оформите заказ" : "Ваша корзина пуста"}
          </DialogDescription>
        </DialogHeader>

        {items.length > 0 ? (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.name} className="flex gap-3 rounded-lg border border-black/5 bg-stone-50 p-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-semibold text-amber-700">{item.price}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        >
                          <Icon name="Minus" size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0"
                          onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        >
                          <Icon name="Plus" size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => removeItem(item.name)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-amber-50 p-4">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-xl font-bold text-amber-700">{totalPrice.toLocaleString()} ₽</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Ваше имя *
                </label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Телефон *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 999 123-45-67"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email (необязательно)
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">
                  Комментарий к заказу
                </label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Удобное время для звонка, пожелания..."
                  rows={3}
                />
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                  <Icon name="CheckCircle2" size={18} />
                  Заказ успешно отправлен! Мы скоро свяжемся с вами.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <Icon name="AlertCircle" size={18} />
                  Ошибка отправки. Попробуйте позже или позвоните нам.
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Продолжить покупки
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Icon name="Loader2" size={18} className="animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={18} />
                      Оформить заказ
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <Icon name="ShoppingCart" size={48} className="text-slate-300" />
            <p className="text-slate-600">Добавьте товары из каталога</p>
            <Button onClick={onClose}>Перейти к каталогу</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}