const path = require("path");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
dotenv.config({ path: process.cwd() + '/.env.local', override: true });
const mode = process.env.NODE_ENV.trim() || "development";

module.exports = {
  entry: "./src/scripts/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: "head",
      template: "public/index.html",
    }),
    new CopyWebpackPlugin({patterns: [{ from: "public/assets", to: "assets" }]}),
    /*new BundleAnalyzerPlugin() */
  ],
  devServer: {
    port: 9000,
  },

  mode,
};
