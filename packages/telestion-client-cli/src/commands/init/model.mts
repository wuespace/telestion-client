import { BaseOptions } from '../../model/index.mjs';

export interface InitOptions extends BaseOptions {
	/**
	 * The name of the new Telestion Frontend Project.
	 *
	 * _Note:_ This option is ignored if the working directory is a Telestion Project.
	 */
	name: string;

	/**
	 * The name of the template package.
	 */
	template: string;

	/**
	 * When `true`, initialize a git repository in the Frontend Project directory.
	 *
	 * _Note:_ This option is ignored if the working directory is a Telestion Project.
	 */
	initGit: boolean;

	/**
	 * When `true`, install production and development dependencies with pnpm.
	 */
	install: boolean;

	/**
	 * When `true`, add the changes to the git staging list and commit them.
	 */
	commit: boolean;

	/**
	 * Optional git username that is used in git commits.
	 * When provided, the git init stage doesn't ask for the username.
	 */
	gitUsername: string | undefined;

	/**
	 * Optional git email that is used in git commits.
	 * When provided, the git init stage doesn't ask for the email address.
	 */
	gitEmail: string | undefined;
}

/**
 * The default options for the init command.
 */
export const defaultOptions: Partial<InitOptions> = {
	template: '@wuespace/telestion-client-template',
	initGit: true,
	install: true,
	commit: true,
	gitUsername: undefined,
	gitEmail: undefined
};
