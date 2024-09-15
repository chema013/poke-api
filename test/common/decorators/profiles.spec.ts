import { Reflector } from '@nestjs/core'

import { Profiles } from '../../../src/common/decorators/profiles'

describe('Profiles Decorator', () => {
  const reflector = new Reflector()

  it('should set metadata with profiles', () => {
    const testProfiles = ['admin', 'user']
    class TestClass {
      @Profiles(...testProfiles)
      testMethod() {}
    }

    const metadata = reflector.get('profiles', TestClass.prototype.testMethod)
    expect(metadata).toEqual(testProfiles)
  })

  it('should set empty profiles if none provided', () => {
    class TestClass {
      @Profiles()
      testMethod() {}
    }

    const metadata = reflector.get('profiles', TestClass.prototype.testMethod)
    expect(metadata).toEqual([])
  })
})
