w . s e t T i m e o u t ( f u n c t i o n ( )   { {  
     w i n d o w . s e t T i m e o u t ( f u n c t i o n ( )   { {  
         d o c u m e n t . _ _ $ w e b d r i v e r A s y n c T i m e o u t   =   1 ;  
     } } ,   0 ) ;  
 } } ,   { 1 } ) ;  
 d o c u m e n t . _ _ $ w e b d r i v e r A s y n c T i m e o u t   =   0 ;  
 v a r   c a l l b a c k   =   f u n c t i o n ( v a l u e )   { {  
     d o c u m e n t . _ _ $ w e b d r i v e r A s y n c T i m e o u t   =   0 ;  
     d o c u m e n t . _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t   =   v a l u e ;  
     w i n d o w . c l e a r T i m e o u t ( t i m e o u t I d ) ;  
 } } ;  
 v a r   a r g s A r r a y   =   A r r a y . p r o t o t y p e . s l i c e . c a l l ( a r g u m e n t s ) ;  
 a r g s A r r a y . p u s h ( c a l l b a c k ) ;  
 i f   ( d o c u m e n t . _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t   ! = =   u n d e f i n e d )   { {  
     d e l e t e   d o c u m e n t . _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t ;  
 } }  
 ( f u n c t i o n ( )   { {  
 { 2 }  
 } } ) . a p p l y ( n u l l ,   a r g s A r r a y ) ;  Åv a r   p e n d i n g I d   =   ' { 0 } ' ;  
 i f   ( d o c u m e n t . _ _ $ w e b d r i v e r P a g e I d   ! =   ' { 1 } ' )   { {  
     r e t u r n   [ p e n d i n g I d ,   - 1 ] ;  
 } }   e l s e   i f   ( ' _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t '   i n   d o c u m e n t )   { {  
     v a r   v a l u e   =   d o c u m e n t . _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t ;  
     d e l e t e   d o c u m e n t . _ _ $ w e b d r i v e r A s y n c S c r i p t R e s u l t ;  
     r e t u r n   v a l u e ;  
 } }   e l s e   { {  
     r e t u r n   [ p e n d i n g I d ,   d o c u m e n t . _ _ $ w e b d r i v e r A s y n c T i m e o u t ] ;  
 } }  
  D e t e c t e d   a   n e w   p a g e   l o a d   w h i l e   w a i t i n g   f o r   a s y n c   s c r i p t   r e s u l t . 
 S c r i p t :    wT i m e d   o u t   w a i t i n g   f o r   a s y n c   s c r i p t   c a l l b a c k . 
 E l a p s e d   t i m e :    +m i l l i s e c o n d s 
 S c r i p t :    AU n a b l e   t o   d e l e t e   d i r e c t o r y   ' { 0 } '  	P A T H  N  { 0 } . { 1 } . { 2 }  £T h e   f i l e   s p e c i f i e d   d o e s   n o t   e x i s t ,   a n d   y o u   h a v e   s p e c i f i e d   n o   i n t e r n a l   r e s o u r c e   I D  C a n n o t   f i n d   a   f i l e   n a m e d   ' { 0 } '   o r   a n   e m b e d d e d   r e s o u r c e   w i t h   t h e   i d   ' { 1 } ' .  u n k n o w n  u n a m e  d a r w i n  m a c  l i n u x  w i n d o w s  7d d d   M M / d d / y y y y   H H : m m : s s   U T C  ;   s e c u r e  ;   h t t p O n l y  sY o u   c a n   o n l y   a d d   o n e   a c t i o n   p e r   d e v i c e   f o r   a   s i n g l e   t i c k .  d e f a u l t   m o u s e  !d e f a u l t   k e y b o a r d  ¯T h e   I W e b D r i v e r   o b j e c t   m u s t   i m p l e m e n t   o r   w r a p   a   d r i v e r   t h a t   i m p l e m e n t s   I H a s I n p u t D e v i c e s .  ­T h e   I W e b D r i v e r   o b j e c t   m u s t   i m p l e m e n t   o r   w r a p   a   d r i v e r   t h a t   i m p l e m e n t s   I A c t i o n E x e c u t o r .  OT h e   k e y   v a l u e   m u s t   n o t   b e   n u l l   o r   e m p t y  t h e K e y  k e y s T o S e n d  wM o v e T o E l e m e n t   c a n n o t   m o v e   t o   a   n u l l   e l e m e n t   w i t h   n o   o f f s e t .  t o E l e m e n t  ©T h e   I W e b E l e m e n t   o b j e c t   m u s t   i m p l e m e n t   o r   w r a p   a n   e l e m e n t   t h a t   i m p l e m e n t s   I L o c a t a b l e .  e l e m e n t  d e v i c e  9I n p u t   d e v i c e   c a n n o t   b e   n u l l .  !i n t e r a c t i o n T o A d d  _I n t e r a c t i o n   t o   a d d   t o   s e