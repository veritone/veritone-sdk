export const generateOrganizations = function(
  n,
  nWithPermission = 0,
  permission = 'viewer'
) {
  const organizationById = {};
  for (let i = 1; i <= n; i++) {
    const organization = {
      id: 'orgId' + i,
      name: 'Organization ' + i
    };
    if (i <= nWithPermission) {
      organization.permission = permission;
    }
    organizationById[organization.id] = organization;
  }
  return organizationById;
};
