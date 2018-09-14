import { slice } from 'lodash';

export const generateAffiliates = function(n, setSchedule) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    const affiliate = {
      id: String(i),
      name: 'Affiliate Station ' + i,
      timeZone: 'US/Eastern'
    };
    if (setSchedule) {
      affiliate.schedule = {
        scheduleType: 'Recurring',
        start: '2018-04-14T19:48:25.147Z',
        end: '2018-04-17T19:48:25.147Z',
        repeatEvery: {
          number: '1',
          period: 'week'
        },
        weekly: {
          Wednesday: [
            {
              start: '16:33',
              end: '17:21',
              timeZone: 'US/Eastern'
            }
          ],
          Thursday: [
            {
              start: '12:33',
              end: '03:21',
              timeZone: 'US/Eastern'
            },
            {
              start: '01:00',
              end: '01:00',
              timeZone: 'US/Eastern'
            }
          ],
          selectedDays: {
            Wednesday: true,
            Thursday: true
          }
        }
      };
    }
    result.push(affiliate);
  }
  return result;
};

export const generateAffiliateById = function(n, setSchedule) {
  const affiliateById = {};
  generateAffiliates(n, setSchedule).forEach(
    affiliate => (affiliateById[affiliate.id] = affiliate)
  );
  return affiliateById;
};

export const AFFILIATES_LIST = generateAffiliates(222);

export const loadNextAffiliates = function({
  limit,
  offset,
  nameSearchText = ''
}) {
  return Promise.resolve(
    slice(
      AFFILIATES_LIST.filter(affiliate =>
        affiliate.name.toLowerCase().includes(nameSearchText.toLowerCase())
      ),
      offset,
      offset + limit
    )
  );
};
