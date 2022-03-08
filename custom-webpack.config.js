// https://alligator.io/angular/Custom-webpack-config/
// https://www.youtube.com/watch?v=-z366vpKXFs

module.exports = {
    module:
    {
        rules:
        [
            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },

            //glsl
            {
                test: /\.glsl$/,
                use:
                [
                    'webpack-glsl-loader'
                ]
            }
        ]
    }
}