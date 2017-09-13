package permissions

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPermissionsToMasks(t *testing.T) {
	perms := []int{1, 13, 26, 31, 62}
	masks := GetMasksFromPermissionIDs(perms)
	expected := []int{-2080366590, 1073741824}
	assert.True(t, len(masks) > 0, "should get valid masks")
	assert.Equal(t, expected, masks, "result should match expected")
}

func TestMasksToPermissions(t *testing.T) {
	masks := []int{-2080366590, 1073741824}
	perms := GetPermissionIDsFromMasks(masks)
	expected := []int{1, 13, 26, 31, 62}
	assert.True(t, len(perms) > 0, "should get valid permissions")
	assert.Equal(t, expected, perms, "result should match expected")
}

func TestOutOfBoundsMasksToPermissions(t *testing.T) {
	masks := []int{2147483648, 2}
	perms := GetPermissionIDsFromMasks(masks)
	expected := []int{1}
	assert.True(t, len(perms) > 0, "should get valid permissions")
	assert.Equal(t, expected, perms, "result should match expected")
}

func TestGetPermissionID(t *testing.T) {
	var id int
	var err error
	parser, err := NewPermissionParser()
	assert.Nil(t, err, "should not error getting parser")
	defer parser.Free()

	id, err = parser.GetPermissionID("superadmin")
	assert.Nil(t, err, "should not error looking up superadmin")
	assert.Equal(t, 1, id, "superadmin should get id 1")

	id, err = parser.GetPermissionID("cms.media.read")
	assert.Nil(t, err, "should not error looking up cms.media.read")
	assert.Equal(t, 15, id, "cms.media.read should get id 15")

	_, err = parser.GetPermissionID("discovery.analytics")
	assert.NotNil(t, err, "should error on incomplete path")

	_, err = parser.GetPermissionID("nonexistent.path")
	assert.NotNil(t, err, "should error on nonexistent path")
}
