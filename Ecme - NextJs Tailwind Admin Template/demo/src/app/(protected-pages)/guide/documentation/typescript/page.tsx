import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'
const Page = () => {
    return (
        <>
            <p>
                This guide will walk you through configuring TypeScript settings
                and taking advantage of its features in Elsatr. Since Ecme is
                fully developed in TypeScript, it allows you to write type-safe
                and scalable code, making it easier to build modern web
                applications.
            </p>
            <div className="mt-10" id="config-ts-settings">
                <h5>Configuring TypeScript Settings</h5>
                <p>
                    Proper configuration is essential in TypeScript projects as
                    it lets you customize various compiler options to suit your
                    project&apos;s needs. You can adjust these settings in the{' '}
                    <code>tsconfig.json</code> file.
                </p>
            </div>
            <div className="mt-10" id="adjusting-ts-strictness">
                <h5>Adjusting TypeScript Strictness</h5>
                <p>
                    We understand that not everyone may be comfortable with
                    TypeScript&apos;s strict type checking. If you prefer a more
                    relaxed, JavaScript-like experience, you can adjust the
                    settings to allow for weaker type checking.
                </p>
                <p>
                    Here&apos;s an example of a <code>tsconfig.json</code>{' '}
                    configuration for weak type checking:
                </p>
                <SyntaxHighlighter language="json">{`{
  "compilerOptions": {
    "strict": false,
    ...
  }
}`}</SyntaxHighlighter>
                <p>
                    This setup relaxes TypeScript&apos;s strictness, giving you more
                    flexibility and a coding experience closer to JavaScript.
                </p>
            </div>
            <div className="mt-10" id="turn-off-ts-check-for-next-build">
                <h5>Turn off typescript check for Next.js production build</h5>
                <p>
                    By default, Next.js will perform strict type checking during
                    the build process. If you prefer to turn off type checking
                    for the production build, you can adjust the{' '}
                    <code>next.config.js</code> file as follows.
                </p>
                <SyntaxHighlighter language="js">{`module.exports = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}`}</SyntaxHighlighter>
                <p>
                    This setup relaxes TypeScript&apos;s strictness, giving you more
                    flexibility and a coding experience closer to JavaScript.
                </p>
            </div>
        </>
    )
}

export default Page
