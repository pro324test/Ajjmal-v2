'use client'

import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './SignInForm'
import OauthSignIn from './OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import useTheme from '@/utils/hooks/useTheme'
import { useTranslation } from '@/utils/hooks/useTranslation'
import type { OnSignIn } from './SignInForm'
import type { OnOauthSignIn } from './OauthSignIn'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    onSignIn?: OnSignIn
    onOauthSignIn?: OnOauthSignIn
}

const SignIn = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    onSignIn,
    onOauthSignIn,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const t = useTranslation()

    const mode = useTheme((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    logoWidth={60}
                    logoHeight={60}
                />
            </div>
            <div className="mb-10">
                <h2 className="mb-2">{t('authentication.welcomeBack')}</h2>
                <p className="font-semibold heading-text">
                    {t('authentication.enterCredentials')}
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            href={forgetPasswordUrl}
                            className="font-semibold heading-text mt-2 underline"
                            themeColor={false}
                        >
                            {t('authentication.forgotPassword')}
                        </ActionLink>
                    </div>
                }
                onSignIn={onSignIn}
            />
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
                    <p className="font-semibold heading-text">
                        {t('authentication.continueWith')}
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
                </div>
                <OauthSignIn
                    setMessage={setMessage}
                    onOauthSignIn={onOauthSignIn}
                />
            </div>
            <div>
                <div className="mt-6 text-center">
                    <span>{t('authentication.dontHaveAccount')} </span>
                    <ActionLink
                        href={signUpUrl}
                        className="heading-text font-bold"
                        themeColor={false}
                    >
                        {t('authentication.signUp')}
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

export default SignIn
