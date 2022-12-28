import { View, Divider, Flex, Heading } from '@adobe/react-spectrum';
import { useSpectrumColor } from '../../../../../../hooks';

/**
 * React Props of {@link ConfigHeader}
 *
 * For more information about React Props, please look here:
 * {@link https://reactjs.org/docs/components-and-props.html}
 *
 * @see {@link ConfigHeader}
 * @see {@link https://reactjs.org/docs/components-and-props.html}
 */
export interface ConfigHeaderProps {
	/**
	 * The title/widgetName of the widget.
	 */
	title: string;

	/**
	 * The unique identifier of the widget in the dashboard configuration.
	 */
	id: string;

	/**
	 * Additional elements that should be rendered next to the heading
	 * in a flexbox row.
	 */
	// Ask the react-spectrum team for bad typings. :/
	children: any;
}

/**
 * Renders the widget configuration header.
 *
 * Here are the widget name/title and the id displayed.
 *
 * The action controls allows the user
 * to copy and paste the configuration from one widget to another.
 *
 * @see {@link ConfigHeaderProps}
 * @see {@link ConfigContainer}
 * @see {@link WidgetRenderer}
 *
 * @example
 * ```tsx
 * function WidgetRenderer() {
 * 	return inConfig ? (
 * 		<ConfigContainer>
 * 			<ConfigHeader />
 * 			{...elements}
 * 		</ConfigContainer>
 * 	) : (
 * 		<Content {...props}>
 * 	);
 * }
 * ```
 */
export function ConfigHeader({ title, id, children }: ConfigHeaderProps) {
	const [idColor] = useSpectrumColor(['gray-400']);

	return (
		<>
			<View
				flexShrink={0}
				width="100%"
				paddingX="size-200"
				paddingY="size-100"
				data-testid="telestionClientConfigHeader"
			>
				<Flex
					direction="row"
					width="100%"
					justifyContent="space-between"
					alignItems="center"
				>
					<Flex direction="row" alignItems="baseline" gap="size-100">
						<Heading
							flexGrow={0}
							margin={0}
							level={3}
							data-testid="telestionClientConfigHeader-title"
						>
							{title}
						</Heading>
						<em
							style={{ color: idColor }}
							data-testid="telestionClientConfigHeader-id"
						>
							ID: {id}
						</em>
					</Flex>

					{children}
				</Flex>
			</View>

			<Divider size="S" />
		</>
	);
}
