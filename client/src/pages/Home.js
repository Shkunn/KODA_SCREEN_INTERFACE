import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { motion, AnimatePresence } from 'framer-motion'


const socket = io.connect('http://0.0.0.0:5000')

var i = 0

function Home() {

    const [mode, setMode] = useState()
    const [mouv, setMouv] = useState(false)

    const tab = ['IN_DELIVERY', 'WAITING', 'ERROR', 'DISCONNECTED', 'OPEN', 'CLOSE', 'WAITING_FOR_CODE'];

    const display_message = {
        'IN_DELIVERY': 'En Livraison',
        'WAITING': "En atttente",
        'ERROR': 'Un problème est arrivé',
        'DISCONNECTED': 'Un problème est arrivé (disconnected)',
        'OPEN': 'Le casier est ouvert',
        'CLOSE': 'Le casier est fermé',
        'WAITING_FOR_CODE' : 'Rentrez votre code pour déverouillez le casier'
    }

    const color = {
        'IN_DELIVERY': '#4FB286',
        'WAITING': '#334195',
        'ERROR': '#81171B',
        'DISCONNECTED': '#81171B',
        'OPEN': '#D65108',
        'CLOSE': '#62A8AC',
        'WAITING_FOR_CODE': '#5ABCB9'
    }

    const [selectedTab, setSelectedTab] = useState(tab[0])

    const [counter, setCounter] = useState(1);

    useEffect(() => {
        clearTimeout(counter)
        setTimeout(() => setCounter((counter + 1) % 12), 5000);
    }, [counter]);

    useEffect(() => {
        socket.emit('interface', "123")
    }, [])

    useEffect(() => {
        socket.on('data_to_interface', (data) => {
            console.log(data)
            setMode(data)
            setSelectedTab(data)
        })
    }, [])

    const ramdom_variants = {

        //BLINK
        0: {
            scaleY: [1, 0, 1],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1]
            }
        },

        //TOP_LEFT_EYE
        1: {
            y: [0, -20, 0],
            x: [0, 30, 0],
            transition: {
                duration: 2,
                times: [0, 0.4, 1]
            }
        },

        //SUSPICIOUS_RIGHT
        2: {
            scaleY: [1, 0.3, 1],
            x: [0, 100, 0],
            transition: {
                duration: 4,
                times: [0, 0.3, 1]
            }
        },

        //BLINK
        3: {
            scaleY: [1, 0, 1],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1]
            }
        },

        //RIGHT_EYE
        4: {
            x: [0, 100, 0],
            transition: {
                duration: 2,
                times: [0, 0.4, 1]
            }
        },

        //SUSPICIOUS_RIGHT_LEFT
        5: {
            scaleY: [1, 0.3, 0.3, 1],
            x: [0, 100, -100, 0],
            transition: {
                duration: 4,
                times: [0, 0.3, 0.6, 1]
            }
        },

        //RIGHT_LEFT_EYE
        6: {
            x: [0, 100, -100, 0],
            transition: {
                duration: 2,
                times: [0, 0.2, 0.8, 1]
            }
        },

        //BLINK
        7: {
            scaleY: [1, 0, 1],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1]
            }
        },

        //LEFT_EYE
        8: {
            x: [0, -100, 0],
            transition: {
                duration: 2,
                times: [0, 0.4, 1]
            }
        },

        //TOP_RIGHT_EYE
        9: {
            y: [0, -20, 0],
            x: [0, -30, 0],
            transition: {
                duration: 2,
                times: [0, 0.4, 1]
            }
        },

        //BLINK
        9: {
            scaleY: [1, 0, 1],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1]
            }
        },

        //SUSPICIOUS_LEFT
        10: {
            scaleY: [1, 0.3, 1],
            x: [0, -100, 0],
            transition: {
                duration: 4,
                times: [0, 0.3, 1]
            }
        },

        //SUSPICIOUS_LEFT_RIGHT
        11: {
            scaleY: [1, 0.3, 0.3, 1],
            x: [0, -100, 100, 0],
            transition: {
                duration: 4,
                times: [0, 0.3, 0.6, 1]
            }
        },

        Waiting: {
            x: [0, 100, -100, 0],
            scale: [0.8, 1, 0.8],
            transition: {
                // delay: 1,
                duration: 3,
                repeat: 2,
                times: [0, 0.2, 0.8, 1]
            }
        }
    };


    return (

        <div className="home" >

            {/* <button onClick={() => {
                setMouv(!mouv)
                i += 1
                setSelectedTab(tab[i % 5])
            }}>
                click
            </button> */}

            <AnimatePresence exitBeforeEnter>
                <motion.div
                    className="status"
                    key={selectedTab ? selectedTab : "empty"}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.15 }}
                >
                    {display_message[selectedTab]}
                </motion.div>
            </AnimatePresence>

            <div className="eyes_frame" style={{ backgroundColor: color[selectedTab] }}>
                <motion.div
                    variants={ramdom_variants}
                    animate={counter.toString()}
                    className="eye_left"
                >
                </motion.div>

                <motion.div
                    variants={ramdom_variants}
                    animate={counter.toString()}
                    className="eye_right"
                >

                </motion.div>
            </div>

            {
                selectedTab === 'WAITING' ?
                    <AnimatePresence exitBeforeEnter>
                        <motion.div
                            className="message"
                            animate={{
                                opacity: 1,
                                scale: [1, 0.8, 1],
                                transition: {
                                    duration: 3,
                                    times: [0, 0.5, 1],
                                    repeat: Infinity
                                }
                            }}
                        >
                            Commande avec moi !
                        </motion.div>
                    </AnimatePresence>

                    :

                    null
            }


        </div >
    );
}

export default Home