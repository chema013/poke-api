import { JwtStrategy } from '../../../../src/Infraestructure/adapterAuth/strategies/jwt.strategy'

describe('JwtStrategy', () => {
  let strategy: JwtStrategy

  beforeEach(() => {
    strategy = new JwtStrategy()
  })

  it('should be defined', () => {
    expect(strategy).toBeDefined()
  })

  it('should validate payload correctly', () => {
    const payload = { sub: '12345', username: 'testuser' }
    const result = strategy.validate(payload)
    expect(result).toEqual({ userId: '12345', username: 'testuser' })
  })
})
