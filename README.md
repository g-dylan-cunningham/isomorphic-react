# isomorphic-react

# "node babeltest" will not run
# we must use "babel-node babeltest"


## webpack
# could not run webpack command to bundle at first
# had to specify where the config is:
#       webpack --config webpack.config.dev.babel.js
# run script now uses cross-env dep
#       cross-env NODE_ENV=development babel-node server


## api setup
# we have live data api right now but also some mock data as a fallback
# new run script to use live data (mock data is default)
#       cross-env NODE_ENV=development babel-node server --useLiveData=true 
#       useLiveData set to false if we want to run mock data