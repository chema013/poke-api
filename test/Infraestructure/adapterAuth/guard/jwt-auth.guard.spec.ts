import { JwtAuthGuard } from '../../../../src/Infraestructure/adapterAuth/guards/jwt-auth.guard'

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard

  beforeEach(() => {
    guard = new JwtAuthGuard()
  })

  it('should be defined', () => {
    expect(guard).toBeDefined()
  })
})
