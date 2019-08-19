import { Mixins, MixinsOptions } from '@material-ui/core/styles/createMixins';
import { CSSProperties } from '@material-ui/styles';

declare module '@material-ui/core/styles/createMixins' {
    interface Mixins {
        drawerToolbar: CSSProperties;
        drawerItem: CSSProperties;
    }

    interface MixinsOptions {
        drawerToolbar?: CSSProperties;
        drawerItem?: CSSProperties;
    }
}
