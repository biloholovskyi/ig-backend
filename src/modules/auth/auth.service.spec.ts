import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaService } from '@/core/prisma/prisma.service'
import { SupabaseService } from '@/core/supabase/supabase.service'
import { AuthService } from './auth.service'

// Plain vi.fn() objects — used for mock setup (.mockResolvedValue, assertions)
const supabase = {
  auth: {
    signInWithPassword: vi.fn(),
    refreshSession: vi.fn(),
  },
  adminAuth: {
    admin: {
      createUser: vi.fn(),
      signOut: vi.fn(),
    },
  },
}

const prisma = {
  user: {
    create: vi.fn(),
    findUniqueOrThrow: vi.fn(),
  },
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(() => {
    vi.clearAllMocks()
    service = new AuthService(
      prisma as unknown as PrismaService,
      supabase as unknown as SupabaseService,
    )
  })

  describe('register', () => {
    it('creates Supabase user, Prisma user, and returns tokens', async () => {
      supabase.adminAuth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'uid-123' } },
        error: null,
      })
      prisma.user.create.mockResolvedValue({
        id: 'uid-123',
        email: 'test@test.com',
        name: 'Test User',
        createdAt: new Date('2026-01-01'),
      })
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: { access_token: 'at-abc', refresh_token: 'rt-abc', expires_in: 3600 } },
        error: null,
      })

      const result = await service.register({
        email: 'test@test.com',
        password: 'Password1!',
        name: 'Test User',
      })

      expect(supabase.adminAuth.admin.createUser).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Password1!',
        email_confirm: true,
      })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { id: 'uid-123', email: 'test@test.com', name: 'Test User' },
        select: { id: true, email: true, name: true, createdAt: true },
      })
      expect(result.access_token).toBe('at-abc')
      expect(result.refresh_token).toBe('rt-abc')
      // expect(result.user.id).toBe('uid-123')
    })

    it('throws BadRequestException when Supabase createUser fails', async () => {
      supabase.adminAuth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })

      await expect(
        service.register({ email: 'taken@test.com', password: 'Password1!', name: 'Test' }),
      ).rejects.toThrow(BadRequestException)
    })

    it('throws InternalServerErrorException when signIn after register fails', async () => {
      supabase.adminAuth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'uid-456' } },
        error: null,
      })
      prisma.user.create.mockResolvedValue({
        id: 'uid-456',
        email: 'new@test.com',
        name: 'New User',
        createdAt: new Date(),
      })
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Unexpected error' },
      })

      await expect(
        service.register({ email: 'new@test.com', password: 'Password1!', name: 'New User' }),
      ).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('login', () => {
    it('returns tokens on valid credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: { access_token: 'at-xyz', refresh_token: 'rt-xyz', expires_in: 900 } },
        error: null,
      })

      const result = await service.login({ email: 'test@test.com', password: 'Password1!' })

      expect(result.access_token).toBe('at-xyz')
      expect(result.refresh_token).toBe('rt-xyz')
      expect(result.expires_in).toBe(900)
    })

    it('throws UnauthorizedException on invalid credentials', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' },
      })

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refresh', () => {
    it('returns new tokens for a valid refresh token', async () => {
      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: { access_token: 'new-at', refresh_token: 'new-rt', expires_in: 900 } },
        error: null,
      })

      const result = await service.refresh('rt-abc')

      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({ refresh_token: 'rt-abc' })
      expect(result.access_token).toBe('new-at')
    })

    it('throws UnauthorizedException on invalid refresh token', async () => {
      supabase.auth.refreshSession.mockResolvedValue({
        data: null,
        error: { message: 'Invalid refresh token' },
      })

      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('calls admin signOut with the Bearer token', async () => {
      supabase.adminAuth.admin.signOut.mockResolvedValue({ error: null })

      await service.logout('bearer-token-abc')

      expect(supabase.adminAuth.admin.signOut).toHaveBeenCalledWith('bearer-token-abc')
    })

    it('throws InternalServerErrorException when signOut fails', async () => {
      supabase.adminAuth.admin.signOut.mockResolvedValue({
        error: { message: 'Session not found' },
      })

      await expect(service.logout('bad-token')).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('getMe', () => {
    it('returns user profile from Prisma', async () => {
      const profile = { id: 'uid-123', email: 'test@test.com', name: 'Test', createdAt: new Date() }
      prisma.user.findUniqueOrThrow.mockResolvedValue(profile)

      const result = await service.getMe('uid-123')

      expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'uid-123' },
        select: { id: true, email: true, name: true, createdAt: true },
      })
      expect(result).toEqual(profile)
    })
  })
})
