
const progressItemHeight = 52;
export default {
  container: {
    position: 'relative',
    paddingBottom: 20,
  },
  contentFlexer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  progressListContainer: {
    minHeight: `calc(${progressItemHeight}px * 3)`,
    maxHeight: `calc(${progressItemHeight}px * 6)`,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  resolveActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 0,
  }
}
