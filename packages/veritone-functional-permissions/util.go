package permissions

import (
	"errors"

	"github.com/Jeffail/gabs"
)

const (
	bucketSize = 32
)

type PermissionParser struct {
	perm *gabs.Container
}

func NewPermissionParser() (*PermissionParser, error) {
	parser := &PermissionParser{}

	err := parser.loadPermissions()
	return parser, err
}

func (parser *PermissionParser) GetPermissionID(path string) (int, error) {
	value, ok := parser.perm.Path(path).Data().(float64)
	if !ok {
		return 0, errors.New("permission path error")
	}

	return int(value), nil
}

// call when no longer need to access permissions
func (parser *PermissionParser) Free() {
	return
}

func (parser *PermissionParser) loadPermissions() error {
	var err error
	parser.perm, err = gabs.ParseJSON([]byte(PermissionsJSON))
	if err != nil {
		return err
	}

	return nil
}

func GetMasksFromPermissionIDs(permissionIDs []int) []int {
	var masks []int

	for _, permission := range permissionIDs {
		bucket := permission / bucketSize
		index := permission % bucketSize

		// grow masks slice if needed
		if bucket+1 > len(masks) {
			t := make([]int, bucket+1)
			for i := range masks {
				t[i] = masks[i]
			}
			masks = t
		}

		// need to do unsigned bitshifting in int32, but still storing int for ease of use
		masks[bucket] = int(int32(uint32(masks[bucket]) | (1 << uint(index))))
	}

	return masks
}

func GetPermissionIDsFromMasks(masks []int) []int {
	var permissions []int

	bucket := 0
	for _, mask := range masks {
		// check mask range
		if mask > 0x7fffffff || mask < -0x80000000 {
			continue
		}

		index := 0
		for {
			if mask&1 > 0 {
				permissions = append(permissions, bucket*bucketSize+index)
			}
			index = index + 1
			// use unsigned int32 bitshifting
			mask = int(uint32(mask) >> 1)
			if mask == 0 {
				break
			}
		}

		bucket = bucket + 1
	}

	return permissions
}
