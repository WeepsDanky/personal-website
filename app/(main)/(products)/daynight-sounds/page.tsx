import Image from 'next/image'

import DayNightSoundsPromo from '~/assets/products/daynight-sounds-promo.png'
import { Container } from '~/components/ui/Container'

const DayNightSounds = () => {
    return ( 
        <Container className="mt-16 sm:mt-24">
            <div className="mt-12 flex justify-center">
                <Image 
                    src={DayNightSoundsPromo} 
                    alt="DayNightSounds product promo"
                    className="rounded-2xl shadow-lg ring-1 ring-zinc-900/5 dark:ring-zinc-700/50"
                    priority
                />
            </div>
        </Container>
     );
}
 
export default DayNightSounds;