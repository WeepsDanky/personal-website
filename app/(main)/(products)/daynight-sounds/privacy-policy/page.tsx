import { Prose } from "~/components/Prose";
import { Container } from "~/components/ui/Container";

const PrivacyPolicy = () => {
    return ( 
        <Container className="mt-16 sm:mt-24">
            <header className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">Privacy Policy / 隐私政策</h1>
            </header>
            <Prose className="mt-8">
                <h2>Privacy Policy (English)</h2>
                <p><strong>Daynight Sounds – Privacy Policy</strong><br /><em>Last updated: 2025-09-07</em></p>
                <p>Your privacy is important to us. This application, <strong>Daynight Sounds</strong>, is designed to provide a simple experience: press play and listen to ambient white noise.</p>
                <h3>Information We Collect</h3>
                <p>We do <strong>not</strong> collect, store, or share any personal information. The app does not use analytics, advertising identifiers, or tracking technologies.</p>
                <h3>Data Usage</h3>
                <ul>
                    <li>No user accounts are required.</li>
                    <li>No data is transmitted to our servers.</li>
                    <li>All audio playback happens locally on your device.</li>
                </ul>
                <h3>Third-Party Services</h3>
                <p>This app does not integrate with any third-party SDKs or analytics platforms.</p>
                <h3>Children’s Privacy</h3>
                <p>The app is safe for all ages. Since no data is collected, there is no additional risk for children.</p>
                <h3>Changes to This Policy</h3>
                <p>If we make changes in the future (for example, to add optional features that may use data), we will update this Privacy Policy and notify users through the app store listing.</p>
                <h3>Contact</h3>
                <p>If you have any questions about this Privacy Policy, please contact us at:<br />gugumeetnow@gmail.com</p>

                <hr />

                <h2>隐私政策（中文）</h2>
                <p><strong>昼夜 – 隐私政策</strong><br /><em>最后更新日期：2025-09-07</em></p>
                <p>我们非常重视您的隐私。本应用 <strong>昼夜</strong> 的设计目标非常简单：点击播放，即可收听环境白噪音。</p>
                <h3>我们收集的信息</h3>
                <p>我们<strong>不会</strong>收集、存储或分享任何个人信息。应用内不使用分析工具、广告标识符或任何跟踪技术。</p>
                <h3>数据使用</h3>
                <ul>
                    <li>无需用户注册或账号。</li>
                    <li>不会向我们的服务器传输任何数据。</li>
                    <li>所有音频播放均在您设备本地完成。</li>
                </ul>
                <h3>第三方服务</h3>
                <p>本应用不包含任何第三方 SDK 或统计分析平台。</p>
                <h3>儿童隐私</h3>
                <p>应用适合所有年龄段使用。由于不收集任何数据，对儿童不存在额外风险。</p>
                <h3>政策更新</h3>
                <p>如果未来新增功能需要使用数据，我们会更新本隐私政策，并在应用商店页面进行说明。</p>
                <h3>联系方式</h3>
                <p>如对本隐私政策有任何疑问，请联系我们：<br />gugumeetnow@gmail.com</p>
            </Prose>
        </Container>
     );
}
 
export default PrivacyPolicy;