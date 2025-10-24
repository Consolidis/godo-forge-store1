'use client';

import { usePathname } from 'next/navigation';
import { Fab, Zoom, useScrollTrigger } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

const ScrollToTopButton = () => {
  const pathname = usePathname();
  // A simple way to detect if we are on a product detail page
  const isProductPage = pathname.startsWith('/shop/') && pathname.length > '/shop/'.length;

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300, // Show button after scrolling 300px
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        color="primary"
        size="small"
        onClick={handleClick}
        aria-label="scroll back to top"
        sx={{
          position: 'fixed',
          // Adjust bottom position on product pages to avoid overlapping the action bar
          bottom: isProductPage ? 112 : 32, // 80px (action bar height) + 32px margin
          right: 32,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: 'grey.800'
          },
          zIndex: 1101 // Ensure it's above the ProductActionBar (which has a z-index of 1100)
        }}
      >
        <ArrowUpward />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;