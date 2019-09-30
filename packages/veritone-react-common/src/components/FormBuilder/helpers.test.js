import * as formHelpers from './helpers';

describe('Validate empty helper', () => {
  it('Should return error if required but no data', () => {
    expect(formHelpers.validateEmpty({
      data: { firstName: '' },
      settings: { name: 'firstName', required: true }
    }))
      .toBe('FIRSTNAME is required')
  })

  it('Should return empty if not required', () => {
    expect(formHelpers.validateEmpty({
      data: { firstName: '' },
      settings: { name: 'firstName', required: false }
    }))
      .toBe(undefined)
  })

  it('Should return empty if not required and not empty', () => {
    expect(formHelpers.validateEmpty({
      data: { firstName: 'veritoneClient' },
      settings: { name: 'firstName', required: true }
    }))
      .toBe('')
  })
})

describe('Validate email helper', () => {
  it('Should return error if not an email', () => {
    expect(formHelpers.validateEmail({
      data: { email: 'abc' },
      settings: { name: 'email' }
    }))
      .toBe('Not an email')
  })

  it('Should not return error if is an email', () => {
    expect(formHelpers.validateEmail({
      data: { email: 'abc@example.com' },
      settings: { name: 'email' }
    }))
      .toBe('')
  })
})

describe('Validate range helper', () => {
  it('Should return an error if larger than max', () => {
    expect(formHelpers.validateRange({
      data: { number: 6 },
      settings: { max: 5, name: 'number' }
    }))
      .toBe('number should be less than or equal to 5')
  })

  it('Should return an error if larger than max', () => {
    expect(formHelpers.validateRange({
      data: { number: 1 },
      settings: { min: 3, name: 'number' }
    }))
      .toBe('number should be greater than or equal to 3')
  })

  it('Should not return an error if in range', () => {
    expect(formHelpers.validateRange({
      data: { number: 4 },
      settings: { min: 3, max: 5, name: 'number' }
    }))
      .toBe(undefined)
  })
})

describe('errorChain', () => {
  const inputObject = { data: {}, settings: {} };
  const errorFunc = formHelpers.errorChain(inputObject);
  it('when input is a function', () => {
    const mockFunc = jest.fn();
    errorFunc(mockFunc);
    expect(mockFunc).toHaveBeenCalledWith(inputObject);
  })
  it('when input is an array of function', () => {
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    const mockFunc3 = jest.fn();
    mockFunc2.mockReturnValue('error');
    expect(errorFunc([mockFunc1, mockFunc2, mockFunc3])).toBe('error');
    expect(mockFunc1).toHaveBeenCalledWith(inputObject);
    expect(mockFunc2).toHaveBeenCalledWith(inputObject);
    expect(mockFunc3).not.toHaveBeenCalled(); // Short circuit if found an error
  })
})
