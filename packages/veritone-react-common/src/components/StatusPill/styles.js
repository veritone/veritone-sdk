export default {
  statusPill: {
    height: 20,
    width: 'fit-content',
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    '& $statusPillText': {
      fontSize: 10,
      fontWeight: 'bold',
      lineHeight: '11px',
      padding: '4px 8px',
      textTransform: 'uppercase',
    }
  },
  statusPillText: {},
}
