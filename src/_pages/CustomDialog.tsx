import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CustomDialog = ({ trigger, title, description, children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Abrir Diálogo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-blue-100 bg-white shadow-lg">
        <DialogHeader className="border-b border-blue-50 pb-4">
          <DialogTitle className="text-xl font-semibold text-blue-900">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-blue-600">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">
          {children}
        </div>

        <DialogFooter className="border-t border-blue-50 pt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default CustomDialog;