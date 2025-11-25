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

interface OrderItem {
  name: string;
  price: string;
  image: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: OrderItem | null;
}

export default function OrderModal({ isOpen, onClose, item }: OrderModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

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
          items: [
            {
              name: item.name,
              price: item.price,
            },
          ],
          total: item.price,
          comment: formData.comment,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", phone: "", email: "", comment: "" });
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Оформление заказа</DialogTitle>
          <DialogDescription>
            Заполните форму, и мы свяжемся с вами для подтверждения заказа
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="flex gap-3 rounded-lg border border-black/5 bg-stone-50 p-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <p className="text-sm font-medium text-slate-900">{item.name}</p>
              <p className="text-base font-semibold text-amber-700">{item.price}</p>
            </div>
          </div>
        )}

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
              Email
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
              Отмена
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
      </DialogContent>
    </Dialog>
  );
}
