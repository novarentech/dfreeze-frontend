import { Pivot as Hamburger } from 'hamburger-react'
import { useState, useEffect } from 'react'

export default function MobileMenuToggle() {
  const [isOpen, setOpen] = useState(false)

  // Sync menu visibility with state
  useEffect(() => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      if (isOpen) {
        menu.classList.remove('grid-rows-[0fr]', 'opacity-0', '-translate-y-2', 'pointer-events-none');
        menu.classList.add('grid-rows-[1fr]', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
      } else {
        menu.classList.add('grid-rows-[0fr]', 'opacity-0', '-translate-y-2', 'pointer-events-none');
        menu.classList.remove('grid-rows-[1fr]', 'opacity-100', 'translate-y-0', 'pointer-events-auto');
      }
    }
  }, [isOpen]);

  // Close menu on resize if above md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <Hamburger 
        toggled={isOpen} 
        toggle={setOpen} 
        size={20} 
        color="#64748b"
        label="Toggle menu"
      />
    </div>
  )
}
