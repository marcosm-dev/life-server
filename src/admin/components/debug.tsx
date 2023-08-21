import React from 'react'

const Debug = (props: any) => <pre>{JSON.stringify(props, null, 4)}</pre>

export default Debug
