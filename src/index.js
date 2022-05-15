import React, { useMemo } from 'react'
import Svg, {
  Defs,
  G,
  Path,
  Rect,
  Image,
  ClipPath,
  LinearGradient,
  Stop,
  Circle,
  Text,
  TextPath
} from 'react-native-svg'
import genMatrix from './genMatrix'
import transformMatrixIntoPath from './transformMatrixIntoPath'

const renderText = ({
  text,
  ratio,
  isCircle,
  size,
  startingPoint,
  color,
  backgroundColor,
  enableLinearGradient,
  cellSize
}) => {
  if (!text || !ratio) {
    return null
  }

  const txtSize = isCircle ? ratio * 16 : ratio * 19

  const numberOfLine = Math.ceil(txtSize / cellSize)
  const txtBaseline = isCircle ? cellSize * numberOfLine - 3 * ratio : 17 * ratio
  const textPath = `M${0} ${size - startingPoint + txtBaseline} L${size} ${size - startingPoint + txtBaseline}`

  return (
    <G>
      <Defs>
        <Path id='textPath' d={textPath} />
      </Defs>
      {isCircle &&
        <Rect
          x={0}
          y={size - startingPoint + cellSize * 0.5}
          width={size}
          height={cellSize * numberOfLine}
          fill={backgroundColor}
        />}
      <Text
        fill={enableLinearGradient ? 'url(#grad)' : color}
        fontSize={txtSize}
        textAnchor={isCircle ? 'middle' : 'end'}
        lineHeight={100}
      >
        <TextPath href='#textPath' startOffset={isCircle ? '50%' : '100%'}>
          {text}
        </TextPath>
      </Text>
    </G>
  )
}

const renderLogo = ({
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius
}) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2
  const logoBackgroundSize = logoSize + logoMargin * 2
  const logoBackgroundBorderRadius =
    logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id='clip-logo-background'>
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id='clip-logo'>
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={logoBackgroundColor}
          clipPath='url(#clip-logo-background)'
        />
      </G>
      <G x={logoMargin} y={logoMargin}>
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio='xMidYMid slice'
          href={logo}
          clipPath='url(#clip-logo)'
        />
      </G>
    </G>
  )
}

const QRCode = ({
  value = 'this is a QR code',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 2,
  logoBorderRadius = 0,
  border = 0,
  enableLinearGradient = false,
  gradientDirection = ['0%', '0%', '100%', '100%'],
  linearGradient = ['rgb(255,0,0)', 'rgb(0,255,255)'],
  ecl = 'M',
  getRef,
  onError,
  isCircle = false,
  text = '',
  ratio
}) => {
  const result = useMemo(() => {
    try {
      return transformMatrixIntoPath(genMatrix(value, ecl), size, isCircle, border)
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error)
      } else {
        // Pass the error when no handler presented
        throw error
      }
    }
  }, [value, size, ecl, border])

  if (!result) {
    return null
  }

  const { path, cellSize, startingPoint } = result
  const quietZone = isCircle ? 0 : border

  return (
    <Svg
      ref={getRef}
      viewBox={[
        -quietZone,
        -quietZone,
        size + quietZone * 2,
        size + quietZone * 2
      ].join(' ')}
      width={size}
      height={isCircle || !text ? size : size + 50 * ratio}
    >
      <Defs>
        <LinearGradient
          id='grad'
          x1={gradientDirection[0]}
          y1={gradientDirection[1]}
          x2={gradientDirection[2]}
          y2={gradientDirection[3]}
        >
          <Stop offset='0' stopColor={linearGradient[0]} stopOpacity='1' />
          <Stop offset='1' stopColor={linearGradient[1]} stopOpacity='1' />
        </LinearGradient>
        {isCircle && (
          <ClipPath id='circle'>
            <Circle cx='50%' cy='50%' r='50%' />
          </ClipPath>
        )}
      </Defs>
      <G clipPath={isCircle ? 'url(#circle)' : ''}>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2 + (isCircle || !text ? 0 : 50 * ratio)}
          fill={backgroundColor}
        />
        <Path
          d={path}
          stroke={enableLinearGradient ? 'url(#grad)' : color}
          strokeWidth={cellSize}
        />
        {renderText({ text, ratio, isCircle, size, startingPoint, color, backgroundColor, enableLinearGradient, cellSize })}
        {isCircle && (
          <Circle
            cx='50%'
            cy='50%'
            r='50%'
            stroke={enableLinearGradient ? 'url(#grad)' : color}
            strokeWidth={border}
            fill='#00000000'
          />
        )}
      </G>
      {logo &&
        renderLogo({
          size,
          logo,
          logoSize: isCircle ? logoSize * 0.6 : logoSize,
          logoBackgroundColor,
          logoMargin: isCircle ? logoMargin * 0.6 : logoMargin,
          logoBorderRadius: isCircle ? logoBorderRadius * 0.6 : logoBorderRadius
        })}
    </Svg>
  )
}

export default QRCode
