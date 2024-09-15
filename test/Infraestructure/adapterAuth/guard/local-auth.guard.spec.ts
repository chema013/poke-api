import { LocalAuthGuard } from '../../../../src/Infraestructure/adapterAuth/guards/local-auth.guard'

describe('LocalAuthGuard', () => {
  let guard: LocalAuthGuard

  beforeEach(() => {
    guard = new LocalAuthGuard()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })
})
