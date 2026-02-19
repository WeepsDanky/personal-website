'use client'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

import { LocaleSwitcher } from '~/app/(main)/LocaleSwitcher'
import { NavigationBar } from '~/app/(main)/NavigationBar'
import { ThemeSwitcher } from '~/app/(main)/ThemeSwitcher'
import {
  GitHubBrandIcon,
  GoogleBrandIcon,
  MailIcon,
  UserArrowLeftIcon,
} from '~/assets'
import { Avatar } from '~/components/Avatar'
import { Container } from '~/components/ui/Container'
import { Tooltip } from '~/components/ui/Tooltip'
import { url } from '~/lib'

export function Header() {
  const [isShowingAltAvatar, setIsShowingAltAvatar] = React.useState(false)
  const onAvatarContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsShowingAltAvatar((prev) => !prev)
    },
    []
  )

  return (
    <header className="pointer-events-none sticky top-0 z-50 h-16 pt-6">
      <Container className="w-full">
        <div className="relative flex gap-4">
          <motion.div
            className="flex flex-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 200,
            }}
          >
            <div
              className="pointer-events-auto"
              onContextMenu={onAvatarContextMenu}
            >
              <Avatar>
                <Avatar.Image alt={isShowingAltAvatar} />
              </Avatar>
            </div>
          </motion.div>
          <div className="flex flex-1 justify-end md:justify-center">
            <NavigationBar.Mobile className="pointer-events-auto relative z-50 md:hidden" />
            <NavigationBar.Desktop className="pointer-events-auto relative z-50 hidden md:block" />
          </div>
          <motion.div
            className="flex justify-end gap-3 md:flex-1"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <UserInfo />
            <div className="pointer-events-auto">
              <LocaleSwitcher />
            </div>
            <div className="pointer-events-auto">
              <ThemeSwitcher />
            </div>
          </motion.div>
        </div>
      </Container>
    </header>
  )
}

function UserInfo() {
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const StrategyIcon = React.useMemo(() => {
    const strategy = user?.primaryEmailAddress?.verification.strategy
    if (!strategy) {
      return null
    }

    switch (strategy) {
      case 'from_oauth_github':
        return GitHubBrandIcon as (
          props: React.ComponentProps<'svg'>
        ) => React.JSX.Element
      case 'from_oauth_google':
        return GoogleBrandIcon
      default:
        return MailIcon
    }
  }, [user?.primaryEmailAddress?.verification.strategy])

  return (
    <AnimatePresence>
      <SignedIn key="user-info">
        <motion.div
          className="pointer-events-auto relative flex h-10 items-center"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <UserButton
            afterSignOutUrl={url(pathname).href}
            appearance={{
              elements: {
                avatarBox: 'w-9 h-9 ring-2 ring-white/20',
              },
            }}
          />
          {StrategyIcon && (
            <span className="pointer-events-none absolute -bottom-1 -right-1 flex h-4 w-4 select-none items-center justify-center rounded-full bg-white dark:bg-zinc-900">
              <StrategyIcon className="h-3 w-3" />
            </span>
          )}
        </motion.div>
      </SignedIn>
      <SignedOut key="sign-in">
        <motion.div
          className="pointer-events-auto"
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 25 }}
        >
          <Tooltip.Provider disableHoverableContent>
            <Tooltip.Root open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <SignInButton mode="modal" forceRedirectUrl={url(pathname).href}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    className="group h-10 rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 text-sm shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20"
                  >
                    <UserArrowLeftIcon className="h-5 w-5" />
                  </button>
                </Tooltip.Trigger>
              </SignInButton>

              <AnimatePresence>
                {tooltipOpen && (
                  <Tooltip.Portal forceMount>
                    <Tooltip.Content asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        登录
                      </motion.div>
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </AnimatePresence>
            </Tooltip.Root>
          </Tooltip.Provider>
        </motion.div>
      </SignedOut>
    </AnimatePresence>
  )
}
