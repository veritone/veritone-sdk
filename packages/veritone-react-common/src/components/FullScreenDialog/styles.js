export default {
  dialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 950,
    background: 'white',
    opacity: 0,
    height: 0,
    overflowY: 'hidden',
    transform: 'translateY(-50px)',
    boxShadow: 'rgba(0, 0, 0, 0.247059) 0 14px 45px, rgba(0, 0, 0, 0.219608) 0 10px 18px',
  },
  dialogIsOpen: {
    height: 'initial',
    opacity: 1,
    transform: 'translateY(0)',
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1), opacity 100ms',
  }
}