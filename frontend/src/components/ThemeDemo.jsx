import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function ThemeDemo() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🎨 shadcn/ui Темы</CardTitle>
          <CardDescription>
            Демонстрация возможностей shadcn/ui с поддержкой тем
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Кнопки</h3>
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Размеры кнопок</h3>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Поля ввода</h3>
              <Input placeholder="Введите текст..." />
              <Textarea placeholder="Многострочный текст..." />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Цвета темы</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">
                  Primary
                </div>
                <div className="h-8 bg-secondary rounded flex items-center justify-center text-secondary-foreground text-xs">
                  Secondary
                </div>
                <div className="h-8 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                  Muted
                </div>
                <div className="h-8 bg-accent rounded flex items-center justify-center text-accent-foreground text-xs">
                  Accent
                </div>
                <div className="h-8 bg-destructive rounded flex items-center justify-center text-destructive-foreground text-xs">
                  Error
                </div>
                <div className="h-8 bg-success rounded flex items-center justify-center text-success-foreground text-xs">
                  Success
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Карточки</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Карточка 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Пример карточки с контентом
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Карточка 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Еще одна карточка
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Карточка 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    И третья карточка
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
