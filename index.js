

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

console.log(document.width)

const createRandomTransforms = length => {
    return [...Array(length)].map( () => ({
            ...createTranslation(Math.random() * document.documentElement.clientWidth*0.001, Math.random() * document.documentElement.clientHeight*0.87),
            ...createRotation(Math.random()*360),
            ...createScale()
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

const listElements = getUnorderedListItems()

console.log('listItems: ', listElements)

const transforms = createRandomTransforms(listElements.length)

const createRandomTransformDiff = (scale = 1) => ({
    translate: {
        x: (Math.random()-0.5) * scale,
        y: (Math.random()-0.5) * scale
    },
    rotate: {
        degrees: (Math.random()-0.5) * scale,
    },
    scale: {
        width: (Math.random() * 0.01 - 0.005)* scale,
        height: (Math.random() * 0.01 - 0.005 )* scale
    }
})

const transformDiffs = transforms.map(transform => createRandomTransformDiff())

console.log('transforms: ', transforms)

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
        // const randomTransformDiff = createRandomTransformDiff()
        // return diffs.map(diff => applyTransformDiffToTransform(diff, createRandomTransformDiff()))\
        return diffs;
    } else {
        return diffs;
    }
}

const loopTransforms = (elements, transforms, diffs) => {
    applyTransforms(elements, transforms);
    const newTransforms = transforms.map((transform, index) => applyTransformDiffToTransform(transform, diffs[index]))
    const possiblyModifiedDiffs = newDiffs(diffs)
    setTimeout(() => loopTransforms(elements, newTransforms, possiblyModifiedDiffs), 17)
}

loopTransforms(listElements, transforms, transformDiffs)