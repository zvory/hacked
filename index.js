const numDomElements=250
const createTextNode = text => document.createTextNode(text)

const createPreNode = text => {
    const pre = document.createElement("PRE")
    pre.appendChild(createTextNode(text))
    return pre
}

const textDictionary = [
    'hacked',
    'hack the planet!',
    'cyberspace',
    'biowarez',
    'black ops',
    'bosozuki',
    'megacorp',
    'chromed',
    'synth',
    'shareware',
    'zaibatsu',
    'wiz',
    'wetware',
    'UNIX',
    'lambda',
    'soykaf',
    'fuark',
    'servo',
    'I/O',
    'the net',
    'deep web',
    'buffer overflow',
    'wired',
    'usenet',
    'RTFM',
    'surveillance',
    'cybersecurity',
    'sybil',
    'kernel',
    'phreaker',
    'jammer',
    'nexus',
    'interface',
    'network',
    'grep',
    'cyborg',
    'c++',
    'assembly',
    'anarchy',
    'blonkchain',
    'crash override'
]

const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const codeDictionary = [
    // 'int main () { printf("hacked"); }'
]

const createInnerElement = () => {
    if (Math.random() * (textDictionary.length + codeDictionary.length) < codeDictionary.length) {
        return createPreNode(sample(codeDictionary))
    } else {
        return createTextNode(sample(textDictionary))
    }
}

const createHackerDomElement = () => {
    const span = document.createElement("span")
    span.appendChild(createInnerElement())
    return span
}

const addDomElementsToBody = (elts) => {
    elts.forEach(elt => document.body.appendChild(elt))
}

const elts = [...Array(numDomElements)].map(() => createHackerDomElement())
addDomElementsToBody(elts)


const getUnorderedListItems = () => {
    const HTMLCollection = document.getElementsByTagName('span')
    return Array.from(HTMLCollection)
}

const createTranslation = (x = 0, y = 0) => ({
    translate: {
        x,
        y
    }
})

const createRotation = (degrees = 0) => ({
    rotate: {
        degrees
    }
})

const createScale = (width = 1, height = 1) => ({
    scale: {
        width,
        height
    }
})

const createEmptyTransforms = length => {
    return [...Array(length)].map( () => ({
            ...createTranslation(),
            ...createRotation(),
            ...createScale()
        }))
}


const createRandomTransforms = length => {
    return [...Array(length)].map( () => ({
            ...createTranslation(Math.random() * document.documentElement.clientWidth, Math.random() * document.documentElement.clientHeight),
            ...createRotation(Math.random()*360),
            ...createScale(Math.random()*7, Math.random()*7)
        }))
}

const createTranslateString = translation => `translate(${translation.x}px, ${translation.y}px) `
const createRotationString = rotation => `rotate(${rotation.degrees}deg) `
const createScaleString = scale => `scale(${scale.width}, ${scale.height}) `

const keyToStringifyFunction = {
    translate: createTranslateString,
    rotate: createRotationString,
    scale: createScaleString
}

const createStyleString = (styles) => {
    let base = 'display: inline-block; transform: '
    for (style in styles) {
        base += keyToStringifyFunction[style](styles[style])
    }
    return base + ';'
}
// background too fast
// add more words than just hacked

// john's suggestiong o receiving a texfile and fucking things up

const listElements = getUnorderedListItems()

const transforms = createRandomTransforms(listElements.length)

const createRandomTransformDiff = (scale = 0.5) => ({
    translate: {
        x: (Math.random()-0.5) * 1.5 * scale,
        y: (Math.random()-0.5) * 1.5 * scale
    },
    rotate: {
        degrees: (Math.random()-0.5) * 0.2 * scale,
    },
    scale: {
        width: (Math.random() * 0.001 - 0.0005)* scale,
        height: (Math.random() * 0.001 - 0.0005)* scale
    }
})

const transformDiffs = transforms.map(transform => createRandomTransformDiff(8))

const applyTransforms = (listElements, transforms) => {
    listElements.forEach((listElement, index) => {
        // console.log(createStyleString(transforms[index]))
        const styleString = createStyleString(transforms[index])
        listElement.setAttribute("style", styleString)
    })
}

const applyTransformDiffToTransform = (transform, diff) => ({
    translate: {
        x: transform.translate.x + diff.translate.x,
        y: transform.translate.y + diff.translate.y
    },
    rotate: {
        degrees: transform.rotate.degrees + diff.rotate.degrees
    },
    scale: {
        width: transform.scale.width + diff.scale.width,
        height: transform.scale.height + diff.scale.height
    }
})

const newDiffs = diffs => {
    if (Math.random() * 10 < 1) {
        return diffs
            .map(diff => applyTransformDiffToTransform(diff, createRandomTransformDiff(0.2)))
    } else {
        return diffs;
    }
}

const adjustTranslateDiff = (translation, translationDiff) => {
    const bounceBackSpeed = 2
    if (translation.x < -100) {
        translationDiff.x = bounceBackSpeed
    }
    if (translation.y < -100) {
        translationDiff.y = bounceBackSpeed
    }
    if (translation.x > document.documentElement.clientWidth + 100) {
        translationDiff.x = -bounceBackSpeed
    }
    if (translation.y > document.documentElement.clientHeight + 100) {
        translationDiff.y = -bounceBackSpeed
    }
    return translationDiff
}

const adjustScaleDiff = (scale, scaleDiff) => {
    // const softMaxAbsScale = 2;
    // if (scale.width > softMaxAbsScale) {
    //     scaleDiff.width = -0.0005;
    // }
    // if (scale.width < -softMaxAbsScale) {
    //     scaleDiff.width = 0.0005;
    // }
    // if (scale.height > softMaxAbsScale) {
    //     scaleDiff.height = -0.0005;
    // }
    // if (scale.height < - softMaxAbsScale) {
    //     scaleDiff.height = 0.0005;
    // }

    const maxAbsScale = 10;
    if (scale.width > maxAbsScale) {
        scaleDiff.width = -0.005;
    }
    if (scale.width < -maxAbsScale) {
        scaleDiff.width = 0.005;
    }
    if (scale.height > maxAbsScale) {
        scaleDiff.height = -0.005;
    }
    if (scale.height < - maxAbsScale) {
        scaleDiff.height = 0.005;
    }
    return scaleDiff;
}

const diffAdjust = (transform, diff) => ({
    translate: adjustTranslateDiff(transform.translate, diff.translate),
    rotate: diff.rotate,
    scale: adjustScaleDiff(transform.scale, diff.scale)
})

const adjustDiffs = (transforms, diffs) => (
    transforms.map((transform, index) => diffAdjust(transform, diffs[index]))
)

const loopTransforms = (elements, transforms, diffs) => {
    applyTransforms(elements, transforms);
    const newTransforms = transforms.map((transform, index) => applyTransformDiffToTransform(transform, diffs[index]))
    const possiblyModifiedDiffs = newDiffs(diffs)
    const adjustedDiffs = adjustDiffs(newTransforms, possiblyModifiedDiffs)
    setTimeout(() => loopTransforms(elements, newTransforms, adjustedDiffs), 17)
}

// applyTransforms(listElements, transforms)
loopTransforms(listElements, transforms, transformDiffs)

const scrollText = (x, dir) => {
    window.scroll(0,x)
    console.log(x, dir)
    if (dir == 'down') {
        if (x > 3000) {
            setTimeout(() => scrollText(x-12, 'up'), 1)
        } else {
            setTimeout(() => scrollText(x+12, 'down'), 1)
        }
    } else if (dir == 'up') {
        if (x < 0) {
            setTimeout(() => scrollText(x+12, 'down'), 1)
        } else {
            setTimeout(() => scrollText(x-12, 'up'), 1)
        }
    }
}

scrollText(0, 'down')

